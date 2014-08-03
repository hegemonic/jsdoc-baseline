{# TODO: WIP #}
<div {{ cssClass('example') }}>
    {% if example.caption %}
        {# TODO: better markup for this #}
        <p {{ cssClass('example-caption') }}>{{ example.caption }}</p>
    {% endif %}
    {# TODO: line numbers: https://github.com/jsdoc3/jsdoc/commit/8663cc42 #}
    <pre {{ cssClass('prettyprint') }}><code>{{ example.code }}</code></pre>
</div>
