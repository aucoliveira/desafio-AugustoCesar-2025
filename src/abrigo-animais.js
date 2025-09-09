class AbrigoAnimais {
  encontraPessoas(brinquedosPessoa1, brinquedosPessoa2, ordemAnimais) {

    const ANIMAIS_CONFIG = {
      rex: { nome: 'Rex', tipo: 'cão', brinquedos: ['RATO', 'BOLA'] },
      mimi: { nome: 'Mimi', tipo: 'gato', brinquedos: ['BOLA', 'LASER'] },
      fofo: { nome: 'Fofo', tipo: 'gato', brinquedos: ['BOLA', 'RATO', 'LASER'] },
      zero: { nome: 'Zero', tipo: 'gato', brinquedos: ['RATO', 'BOLA'] },
      bola: { nome: 'Bola', tipo: 'cão', brinquedos: ['CAIXA', 'NOVELO'] },
      bebe: { nome: 'Bebe', tipo: 'cão', brinquedos: ['LASER', 'RATO', 'BOLA'] },
      loco: { nome: 'Loco', tipo: 'jabuti', brinquedos: ['SKATE', 'RATO'] },
    };

    const todosOsBrinquedosValidos = new Set(Object.values(ANIMAIS_CONFIG).flatMap(a => a.brinquedos));
    const nomesAnimaisValidos = new Set(Object.keys(ANIMAIS_CONFIG));
    
    const listaBrinquedosPessoa1 = brinquedosPessoa1.split(',');
    const listaBrinquedosPessoa2 = brinquedosPessoa2.split(',');
    const listaOrdemAnimais = ordemAnimais.split(',');

    if (new Set(listaOrdemAnimais).size !== listaOrdemAnimais.length) return { erro: 'Animal inválido' };
    for (const animal of listaOrdemAnimais) {
      if (!nomesAnimaisValidos.has(animal.toLowerCase())) return { erro: 'Animal inválido' };
    }
    
    if (new Set(listaBrinquedosPessoa1).size !== listaBrinquedosPessoa1.length) return { erro: 'Brinquedo inválido' };
    for (const brinquedo of listaBrinquedosPessoa1) {
        if (!todosOsBrinquedosValidos.has(brinquedo)) return { erro: 'Brinquedo inválido' };
    }

    if (new Set(listaBrinquedosPessoa2).size !== listaBrinquedosPessoa2.length) return { erro: 'Brinquedo inválido' };
    for (const brinquedo of listaBrinquedosPessoa2) {
        if (!todosOsBrinquedosValidos.has(brinquedo)) return { erro: 'Brinquedo inválido' };
    }

    let pessoa1 = { id: 'pessoa 1', adocoes: 0, brinquedosDisponiveis: [...listaBrinquedosPessoa1] };
    let pessoa2 = { id: 'pessoa 2', adocoes: 0, brinquedosDisponiveis: [...listaBrinquedosPessoa2] };
    
    const resultados = [];

    const verificarAptidao = (animal, pessoa) => {
      if (pessoa.adocoes >= 3) {
        return { apto: false };
      }

      if (animal.nome.toLowerCase() === 'loco') {
        if (pessoa.adocoes === 0) return { apto: false };
        const brinquedosDaPessoaSet = new Set(pessoa.brinquedosDisponiveis);
        const temTodosBrinquedos = animal.brinquedos.every(b => brinquedosDaPessoaSet.has(b));
        return { apto: temTodosBrinquedos, brinquedosUsados: animal.brinquedos };
      }

      let indiceBrinquedoAnimal = 0;
      const brinquedosUsados = [];
      for (const brinquedoPessoa of pessoa.brinquedosDisponiveis) {
        if (indiceBrinquedoAnimal < animal.brinquedos.length && brinquedoPessoa === animal.brinquedos[indiceBrinquedoAnimal]) {
          brinquedosUsados.push(brinquedoPessoa);
          indiceBrinquedoAnimal++;
        }
      }
      
      const apto = indiceBrinquedoAnimal === animal.brinquedos.length;
      return { apto, brinquedosUsados: apto ? brinquedosUsados : [] };
    };

    for (const nomeAnimal of listaOrdemAnimais) {
      const animalAtual = ANIMAIS_CONFIG[nomeAnimal.toLowerCase()];
      
      const aptidaoPessoa1 = verificarAptidao(animalAtual, pessoa1);
      const aptidaoPessoa2 = verificarAptidao(animalAtual, pessoa2);

      let destino = 'abrigo';

      if (aptidaoPessoa1.apto && !aptidaoPessoa2.apto) {
        destino = pessoa1.id;
        pessoa1.adocoes++;
        if (animalAtual.tipo === 'gato') {
          pessoa1.brinquedosDisponiveis = pessoa1.brinquedosDisponiveis.filter(b => !aptidaoPessoa1.brinquedosUsados.includes(b));
        }
      } else if (!aptidaoPessoa1.apto && aptidaoPessoa2.apto) {
        destino = pessoa2.id;
        pessoa2.adocoes++;
        if (animalAtual.tipo === 'gato') {
          pessoa2.brinquedosDisponiveis = pessoa2.brinquedosDisponiveis.filter(b => !aptidaoPessoa2.brinquedosUsados.includes(b));
        }
      }
      
      resultados.push({ nome: animalAtual.nome, destino });
    }

    resultados.sort((a, b) => a.nome.localeCompare(b.nome));
    const listaFinal = resultados.map(r => `${r.nome} - ${r.destino}`);

    return { lista: listaFinal };
  }
}

export { AbrigoAnimais };