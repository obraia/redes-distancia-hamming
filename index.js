const obterPosicoes = (quantidadeBits, valorTransmissor) => {

    const quantidadeBitsTransmissor = valorTransmissor.length;
    const formula = (2 * quantidadeBits) + 1;
    const quantidadeCasas = formula + quantidadeBitsTransmissor;

    let posicoesX = [];


    for (let i = 0; Math.pow(2, i) < quantidadeCasas + 1; i++) {
        posicoesX.push(Math.pow(2, i));
    }

    let posicoesM = [];

    for (let i = 1; i < quantidadeCasas + 1; i++) {
        posicoesM.push(i);
    }

    posicoesM = posicoesM.filter(valorA => !posicoesX.includes(valorA));

    return { posicoesX, posicoesM };
}

const obterCombinacoes = (input, size) => {

    let results = [], result, mask, i, total = Math.pow(2, input.length);

    for (mask = size; mask < total; mask++) {
        result = [];
        i = input.length - 1;

        do {
            if ((mask & (1 << i)) !== 0) result.push(input[i]);
        } while (i--);

        if (result.length >= size) results.push(result);
    }

    return results;
}

const obterValoresXParaM = (posicoesM, combinacoes, bits) => {
    const retorno = [];

    posicoesM.forEach((posicao, index) => {
        const combinacaoM = combinacoes.find(combinacao => {
            const soma = combinacao.reduce((a, b) => a + b, 0);
            if (soma === posicao) return combinacao;
        });

        retorno.push(
            {
                nome: `m${index + 1}`,
                posicao,
                valor: bits[index],
                x: combinacaoM.map(valor => Math.log2(valor))
            }
        );
    });

    return retorno;
}

const obterValoresX = (dadosTramissor, listaX) => {
    const retorno = [];

    listaX.forEach(x => {
        const valores = dadosTramissor.filter(m => m.x.includes(x)).map(m => m.valor);

        // console.log(eval(valores.join('^')) + '^' + valores.join('^'))
        // console.log(eval(valores.join('^') + '^' + eval(valores.join('^'))));

        retorno.push(eval(valores.join('^')));
    });

    return retorno;
}

const obterPosicaoErro = (dadosReceptor, listaX, valoresX) => {
    let bitsErro = '';

    listaX.forEach((x, index) => {
        const valores = dadosReceptor.filter(m => m.x.includes(x)).map(m => m.valor);
        valores.unshift(valoresX[index]);

        bitsErro += eval(valores.join('^'));
    });

    return parseInt(bitsErro.split('').reverse().join(''), 2);
}

const calcularHamming = (bitsTrasmissor, bitsReceptor, quantidadeBits) => {

    const { posicoesX, posicoesM } = obterPosicoes(quantidadeBits, bitsTrasmissor);
    const combinacoes = obterCombinacoes(posicoesX, 2);
    const dadosTramissor = obterValoresXParaM(posicoesM, combinacoes, bitsTrasmissor);
    const listaX = posicoesX.map(valor => Math.log2(valor));
    const valoresFinalX = obterValoresX(dadosTramissor, listaX);

    const dadosReceptor = dadosTramissor.map((valor, index) => ({ ...valor, valor: bitsReceptor[index] }));
    const posicaoErro = obterPosicaoErro(dadosReceptor, listaX, valoresFinalX);

    return { dadosTramissor, dadosReceptor, posicaoErro };
}

const quantidadeBits = 1;
const bitsTrasmissor = '0101';
const bitsReceptor = '0101';

const { dadosTramissor, dadosReceptor, posicaoErro } = calcularHamming(bitsTrasmissor, bitsReceptor, quantidadeBits);

console.log('Dados transmissor:\n', dadosTramissor);
console.log('Dados receptor:\n', dadosReceptor);
console.log('Posição do erro: ', posicaoErro);