var ImageLazy = function() {
	
	return {
		swapLazy = function(el) {
			let src;
			let dataSrc;
			let _img = '';
		   
			let _noscript = $(el).find('.noscript').html();
		   
			//_noscript[0].innerHTML;
			_noscript  =  extractText(_noscript).replace('&lt;', '<').replace('/&gt;', '>'); 
		

			if (_noscript) {
				if (_noscript.length > 7) {
			   
				_img = /<img.*?src="(.*?)"/.exec(_noscript)[1];
				 }
			 }
			
			const _image2 = $(el).find(".productImage").attr("id");            
	

			src = _img;

			if (src) {
				dataSrc = src;           
			} else {
			   
				if (_image2) {
					
				 dataSrc = "https://images.livrariasaraiva.com.br/imagemnet/imagem.aspx/?pro_id="+_image2.split('-')[2]+"&qld=90&l=830&a=-1=1007943217";
				}               
			}   
			
					
			
			$(el)
			.find(".productImage img")
		   .attr("data-img-src", dataSrc);
		

			   
		},
		applyDataLazyAttr = function(showcase) {
			$(showcase).each(
				function(ndx, item) {
					this.swapLazy(item);
				}.bind(this)
			);
		},
		loadLazy = function(showcase) { 
			if (
				(!$("body").hasClass("produto") &&
					Object.keys(vtxctx).includes("departmentName")) ||
				/promo/gi.test(vtxctx.searchTerm) ||
				$("body").hasClass("search-context") 
			) {
				$(showcase).each(
					function(ndx, item) { 
						let _img = $(item).find('noscript');
						_img  =  _img[0].innerHTML;	   
						const _image = $(item).find(".productImage img")[0];
						const _image2 = $(item).find(".productImage").attr("id");
						const src = $(_image).attr("data-img-src");                                             
						
					   $(_image).attr("data-img-src", src);
					}.bind(this)
				);
			}
		}
	}		
			

 
}
		
		
		
window._imageLazy = window._imageLazy || new ImageLazy();
window._imageLazy.applyDataLazyAttr($(".prateleira li ._lazy"));
window._imageLazy.loadLazy($(".prateleira li ._lazy"));
window._imageLazy.swapSlideHome($(".prateleira li ._lazy"));