# VTEX Lazy Loading

> Eu reuni neste repositório um conjunto de soluções que implementei em uma loja Vtex, para resolver um grande problema de carregamento.
> O problema é que todas as imagens são carregadas ao mesmo tempo, a plataforma não da a opção de carregamento sob demanda!

Antes de tudo é importante dizer que usaremos um pollyfill. Pois o "IntersectionObserver" ainda não oferece suporte para todos os navegadores.

### Iniciando o projeto

No template da prateleira/vitrine (Shelves Templates) devemos adicionar um "wraper" para receberr a imagem original.
Na primeira linha de HTML da prateleira adicionei o código desta forma (mudando os nomes das variáveis se necessário)

```
	<div class="noscript">
		<noscript psku="$sku">
			# $product.GetImageTag(221)
		</noscript>
	</div>
```

Na primeira DIV que envolve o produto eu adicionei a classe "_lazy", desta forma:

```	<div class="_lazy product" id="shelf-item-$sku" pid="$id" psku="$sku">
```

* A div com a classe "noscript" foi necessária para resolver um problema de comátibilidade no navegador Edge
* A tag <noscript> renderiza seu contéudo apenas se o javascript estiver desativado. Funcionando como alternativa se algum navegador estiver com o javascript desabilitado. Neste caso, o código do "lazy load" não será executado.
* O "#" dentro do noscript foi inserido propositalmente para quebrar o html, a imagem estava sendo carregada no DOM. No navegador Google Chrome

### Adicionando os scripts

Precisamos "chamar" os dois scripts.
O pollyfill deve ser carregado antes do "vtexlazyload.js".

