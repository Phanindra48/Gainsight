//Insert code below

var GainSight = GainSight || {};

GainSight = (function(){
	"use strict"
	
	var dom = {
		itemsDiv: function(){ return jQuery('#divItems'); }	
	};
	var globals = {
		pageId : -1,
		imagesPerColumn : parseInt($(document).width() / 250, 10),
		defaultImgWidth : 236,
		heightSoFar : {}
	};
	var helpers = {
		init : function(){
			helpers.fetchImages();
			helpers.bindImageEvents();
			$(window).scroll(function(){
		        if ($(window).scrollTop() == $(document).height() - $(window).height()){
		          helpers.fetchImages();
		        }
	      	});
		},
		bindImageEvents:function(){
			dom.itemsDiv().off('click.choice').on('click.choice','.choice',function(e){
				alert('choice');
			});
			dom.itemsDiv().off('click.share').on('click.share','.share',function(e){
				alert('share');
			});
		},
		fetchImages : function(){
			globals.pageId++;
			$.ajax({
				url:'https://gainsight.0x10.info/api/image?page_no=' + globals.pageId,
				dataType: 'json',
				async: false,
				success:function(data){
					$.each(data,function(index,item){

						var col = (index % globals.imagesPerColumn) ;
						if( !(col in globals.heightSoFar)){
							//console.log('col : ' + col);
							globals.heightSoFar[col] = 0;
							
						}
						
						/* get height*/
						var i = new Image();
						var width = 0,height = 0;
						console.log('item.url ->', item.url);
						i.onload = function(){ 
							var pos = {
								top : globals.heightSoFar[col],
								left: col * globals.defaultImgWidth
							};
							height = i.height;
							width = i.width;
							console.log('url->' + item.url + ' width: ' + width + ' height: '+height);

							var imgWidth = globals.defaultImgWidth;
							var imgHeight = (globals.defaultImgWidth * height) / width;

							var obj = helpers.buildItemDiv(item,pos);
							dom.itemsDiv().append(obj.html);
							globals.heightSoFar[col] += imgHeight + 7;

							console.log('index: ' + index + ' col: ' + col + ' height: ' + globals.heightSoFar[col]);
						};
						i.src = item.url;																		
					});
				},
				error:function(){

				}
			});
		},
		buildItemDiv:function(item,pos){
			var div = $('<div>',{ 
				'class':'item grid-item',
				'style':'width:236px;top:' + pos.top + 'px;left:' + pos.left + 'px'
			});
			var imageId = 'img_' + Date.now();
			var imageElem = $('<a>',{
				href:'#',
				'data-demographic' : JSON.stringify(item.demographic)
			})
			.append($('<img>',{
				'class' : 'img',
			 	'src' : item.url,
			 	'width':'100%',
			 	'id': imageId
			})); 
			var shareBtn = $('<a>',{href:'#','class':'share buttons'})
				.append($('<span>',{
					'class' : "fa fa-2x fa-share-alt"
				}));
			var downloadBtn = $('<a>',{href:item.url,'class':'download buttons','download':"gainsight-image"})
				.append($('<span>',{
					'class' : "fa fa-2x fa-cloud-download"
				}));
			div.append(imageElem)
			.append($('<a>',{href:'#','class':'choice buttons'})
				.append($('<span>',{
					'class' : "fa fa-2x fa-heart"
				}))
			);
			div.append(shareBtn);
			div.append(downloadBtn);
			return {
				'html': div,
				'imageId' : imageId
			};
		},
		drawChart:function(){

		},
		setImagePositions:function(url){
			
		}
	};
	
	var publicAPI = {
		init : helpers.init
	};
	
	return publicAPI;
})();