(function($) {
    // TODO: make the node ID configurable
    var treeNode = $('#jsdoc-toc-nav');

    // initialize the tree
    treeNode.tree({
        autoEscape: false,
        data: {{ tocData|json|safe }},
        saveState: true,
        useContextMenu: false
    });

    // add event handlers
    // TODO
})(jQuery);
