{# TODO: WIP #}
<div {{ cssClass('example') }}>
    {% if example.caption %}
        {# TODO: better markup for this #}
        <p {{ cssClass('example-caption') }}>{{ example.caption }}</p>
    {% endif %}
    {% include 'prettyprint.swig' with example only %}
</div>
