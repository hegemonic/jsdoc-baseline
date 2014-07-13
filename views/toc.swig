(function($) {
    // We use the same character for the closed and open state. The open state is rotated by
    // 90 degrees.
    //var toggleIcon = '&#12297;';
    // TODO: make the node ID configurable
    var treeNode = $('#jsdoc-toc-nav');

    // initialize the tree
    treeNode.tree({
        autoEscape: false,
        //closedIcon: toggleIcon,
        data: {{ tocData|json|safe }},
        //openedIcon: toggleIcon,
        saveState: true,
        useContextMenu: false
    });

    // add event handlers
    // TODO
})(jQuery);
