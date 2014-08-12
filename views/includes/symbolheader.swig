<header {{ cssClass('!page-header') }}>
    {%- spaceless %}
        <h>
            {% if doc.ancestors && doc.ancestors.length %}
                {# TODO: make <small> tag configurable #}
                <small {{ cssClass('symbol-ancestors') }}>
                    {{ ancestorLinks(doc) }}
                </small>
            {% endif %}
            {{ doc.name }}
        </h>
    {% endspaceless -%}

    {%- if doc.classdesc %}
        <div {{ cssClass('!symbol-classdesc') }}>{{ doc.classdesc|resolveLinks|markdown }}</div>
    {% endif -%}

    {%- if doc.kind !== 'class' -%}
        <div {{ cssClass('!symbol-description') }}>
            {% set context = { description: doc.description } %}
            {%- include 'description.swig' with context only -%}
        </div>
    {%- endif -%}

    <dl {{ cssClass('!dl-compact') }}>
        {% set context = {
            doc: doc,
            implementations: doc.implementations,
            implements: doc.implements
        } %}
        {% include 'sourcefile.swig' with context only %}
        {% include 'lists/implements.swig' with context only %}
        {% include 'lists/implementations.swig' with context only %}
    </dl>
</header>
