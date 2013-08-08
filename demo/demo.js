function dedentAll(source){
    // find the least amount of tabbing and dedent each line by that much
    var tabRegex = /\n(\s*?)(\S|\n)/g;
    var spacing = tabRegex.exec(source);
    if(spacing){
        var shortest = spacing[1].length;
        while(spacing){
            if(spacing[1].length < shortest){
                shortest = spacing[1].length;
            }
            spacing = tabRegex.exec(source);
        }
        if(shortest > 0){
            var dedentRegex = new RegExp("\\n\\s{"+shortest+"}", "g");
            source = source.replace(dedentRegex, "\n");
        }
    }
    return source;
}

function cleanHtmlSource(html, ignoreAttrs){
    // remove any attributes given in parameter, but only if they are
    // actually in a tag
    if(ignoreAttrs && ignoreAttrs.length){
        // no global flag, or we will over-skip through string
        var attrIgnoreRegex = new RegExp("(<[^>]*?\\s)(("+
                                         ignoreAttrs.join("|")+
                                         ")=\".*?\"\\s?)([^<]*?>)");
        var match = attrIgnoreRegex.exec(html);
        while(match){
            html = html.substr(0, match.index) + match[1] + match[4] + 
                   html.substr(match.index + match[0].length);
            match = attrIgnoreRegex.exec(html);
        }
        html = html.replace(/\s*>/g, ">");
    }
    
    html = dedentAll(html);
    // trim spacing from start/end of markup
    html = html.replace(/^\s*\n/, "");
    html = html.replace(/\n\s*$/, "");
    return html;
}

// defaults to first item if given item is not in list
function nextItem(items, prevItem){
    if(items.length === 0) return null;
    var index = items.indexOf(prevItem);
    return items[(index+1) % items.length];
}

function updateFlipboxMarkup(flipbox, markupEl, isInit){
    var markup = cleanHtmlSource(flipbox.outerHTML, ["style", "_anim-direction"]);
    markupEl.textContent = markup.replace(/=""/g, "");
    xtag.removeClass(markupEl, "prettyprinted");
    if(!isInit) prettyPrint();
}

function getFlipbox(demoSect){
    return demoSect.querySelector("x-flipbox");
}

function getMarkupEl(demoSect){
    return demoSect.querySelector(".markup-wrap .html");
}

function updateDemoHtml(demoSect, isInit){
    var flipbox = getFlipbox(demoSect);
    var markupEl = getMarkupEl(demoSect);
    if(!(flipbox && markupEl)) return;

    updateFlipboxMarkup(flipbox, markupEl, isInit);
}

document.addEventListener('DOMComponentsLoaded', function(){
    var baseButtonSelector = ".demo-wrap > .markup-wrap > button";

    xtag.addEvent(document, "click:delegate("+baseButtonSelector+".flip)", function(e){
        var demoSect = this.parentNode.parentNode;
        var flipbox = getFlipbox(demoSect);
        flipbox.toggle();

        updateDemoHtml(demoSect);
    });

    xtag.addEvent(document, "click:delegate("+baseButtonSelector+".direction)", function(e){
        var demoSect = this.parentNode.parentNode;
        var flipbox = getFlipbox(demoSect);
        var dirs = ["right", "left", "up", "down"];
        flipbox.direction = nextItem(dirs, flipbox.direction);
        updateDemoHtml(demoSect);
    });

    xtag.addEvent(document, "flipend:delegate(.demo-wrap)", function(e){
        updateDemoHtml(this);
    })

    xtag.query(document, ".demo-wrap").forEach(function(demoSect){
        updateDemoHtml(demoSect, true);
    });

    prettyPrint();
});