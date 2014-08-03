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
            {%- include 'description.swig' with doc -%}
        </div>
    {%- endif -%}

    <dl {{ cssClass('!dl-compact') }}>
        {% include 'sourcefile.swig' with doc %}
    </dl>
</header>
