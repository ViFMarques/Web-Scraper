const puppeteer = require('puppeteer'); // Biblioteca puppeteer


qualProduto() // Função para perguntar o produto
function qualProduto() {
    const readline = require('readline').createInterface({ // Utilizando readLine para guadar input do usuário
        input: process.stdin,
        output: process.stdout
    });
    readline.question('Qual produto você deseja buscar?\n', produto => {
        if (produto) {
            readline.close();
            extrairDadosDoProduto(produto); // Executando a função usando o produto que o usuário digitou
        }
        else {
            readline.close();
            qualProduto() // Pergunta de novo, caso não digite nada
        }
    });
};


async function extrairDadosDoProduto(produtoNome) {

    const browser = await puppeteer.launch({
        headless: 'new',
    });

    const page = await browser.newPage();

    console.log(`Buscando por ${produtoNome}... Aguarde, por favor`);
    await page.goto('https://www.netshoes.com.br/'); // Passa o site da busca

    await page.waitForSelector('#search-input'); // Espera a página carregar completamente antes de clicar no campo pesquisa

    await page.click('#search-input');

    await page.waitForSelector('#search-input');

    await page.type('#search-input', produtoNome); // Digita o produto no campo pesquisa

    await page.keyboard.press('Enter');

    try {
        await page.waitForSelector('.loaded', { timeout: 15000 });

        // Constantes que puxam texto e imagem pelos seletores
        const titulo = await page.$eval('.item-card__description__product-name', el => el.innerText);

        await page.waitForSelector('.haveInstallments');

        const preco = await page.$eval('.haveInstallments', el => el.innerText);
        const imagem = await page.$eval('.loaded', el => el.src);

        await page.click('.loaded'); // Clica na imagem para entrar no produto
        await page.waitForSelector('section.separator > p');

        const descricao = await page.$eval('section.separator > p', el => el.textContent); // Puxa a descrição da página do produto através do seletor

        // Outputs:
        console.log('\n \nTítulo:', titulo,);
        if (preco) {
            console.log('\nPreço Atual: R$', preco)
        } else {
            console.log('\nNão há preço registrado para este produto') // Caso não haja preço registrado no site
        };
        console.log('\nImagem:', imagem);
        console.log('\nDescrição do produto:', descricao, "\n");


        await browser.close();

    } catch (error) {
        console.error('Erro: Não foi possível buscar o produto descrito.');
        await browser.close(); // Apresenta erro caso o usuário digite algo que não existe ou demore mais de 15s pra achar
    }
}

