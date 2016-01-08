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
        data: {name:message.selectionText, uri:rightclicked_item.baseURI, xpath:xpath},
        url: 'http://localhost:8080/TagxusWS/tagws/tags'
    }).done(function (response) {
       var tag = $('<span class="tag">'+ message.selectionText +'</span>');
       $(_x(xpath)).after(tag);
    }).fail(function() {
        alert( "error" );
  });

});

$(document).ready(function () {
    $.ajax({
        type: 'GET',
        dataType: "json",
        url: 'http://localhost:8080/TagxusWS/tagws/tags?uri=' + document.baseURI
    }).done(function (response) {
        $.each(response, function( key, value ) {
          console.log(value);
          var tag = $('<span class="tag">' + value.name + '</span>');
          $(_x(value.xpath)).first().after(tag);
        });
    }).fail(function() {
        alert( "error" );
  });
});