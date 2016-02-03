// Record the last element to be right-clicked, since that information isn't
// passed to the contextmenu click handler that calls top_open_blacklist_ui
var rightclicked_item = null;
if (document.body) {
  document.body.addEventListener("contextmenu", function(e) {
    rightclicked_item = e.srcElement;
  });
  document.body.addEventListener("click", function() {
    rightclicked_item = null;
  });
}

//todo: better way to locate the element
function getXPath(element){
    var xpath = '';
    for ( ; element && element.nodeType == 1; element = element.parentNode ){
        var id = $(element.parentNode).children(element.tagName).index(element) + 1;
        id > 1 ? (id = '[' + id + ']') : (id = '');
        if(element.id){
          return '//*[@id="'+element.id+'"]'+xpath;
        }
        xpath = '/' + element.tagName.toLowerCase() + id + xpath;
    }
    return xpath;
}

function _x(STR_XPATH) {
    var xresult = document.evaluate(STR_XPATH, document, null, XPathResult.ANY_TYPE, null);
    var xnodes = [];
    var xres;
    if (xres = xresult.iterateNext()) {
        xnodes.push(xres);
    }

    return xnodes;
}

chrome.extension.onMessage.addListener(function (message, sender, callback) {
   console.log(message);
   var xpath = getXPath(rightclicked_item);
   console.log(xpath);
  
  $.ajax({
        type: 'POST',
        data: {name:message.selectionText, uri:trimUri(rightclicked_item.baseURI), xpath:xpath},
        url: 'http://localhost:8080/TagxusWS/tags'
    }).done(function (response) {
       var tagId = jQuery.parseJSON(response).id;
       var tag = $('<span class="tagxus" id="tagxus_'+tagId+'">' + message.selectionText +'</span>');
       $(_x(xpath)).after(tag);
    }).fail(function() {
        alert( "error" );
  });

});

function trimUri(uri){
  var i;
  if((i=uri.lastIndexOf("#")) > 0)
    uri = uri.substring(0,i);
  return uri;
}

function gotoAnchor(uri){
  var i;
  if((i=uri.lastIndexOf("#")) > 0){
    location.href = uri.substring(i);
  }
}

$(document).ready(function () {
    $.ajax({
        type: 'GET',
        dataType: "json",
        url: 'http://localhost:8080/TagxusWS/tags?uri=' + encodeURIComponent(trimUri(document.baseURI))
    }).done(function (response) {
        $.each(response, function( key, value ) {
          var tag = $('<span class="tagxus" id="tagxus_'+value.id+'">' + value.name + '</span>');
          $(_x(value.xpath)).after(tag);
        });
        
        gotoAnchor(document.baseURI);
        
    }).fail(function() {
        alert( "error" );
  });
});