{% import 'macros.swig' as macros %}

<h id="{{ doc.id }}">
    {% spaceless %}
        {% autoescape false %}
            {# TODO: do we even set doc.attribs anymore?? should be badges, right? #}
            {{ doc.attribs }}{{ macros.namePrefix(doc.kind) }}{{ doc.name }}
            {% if needsSignature(doc) %}
                {{ macros.signature(doc) }}
            {% elif doc.type && doc.type.names %}
                {# TODO: make <small> tag configurable #}
                <small {{ cssClass('symbol-type') }}>&nbsp;{{ macros.types(doc) }}</small>
            {% endif %}
        {% endautoescape %}
    {% endspaceless -%}
</h>

<section>
    {% set context = { doc: doc } %}
    {% include 'includes/description.swig' with doc only %}
    {% include 'includes/examples.swig' with doc only %}
    {% include 'includes/params.swig' with doc only %}
    {% include 'includes/propertytable.swig' with doc only %}

    <dl {{ cssClass('!dl-compact') }}>
        {% include 'includes/sourcefile.swig' with context only %}
        {% include 'includes/lists/augments.swig' with doc only %}
        {% include 'includes/details.swig' with doc only %}
        {% include 'includes/lists/requires.swig' with doc only %}
        {% include 'includes/lists/fires.swig' with doc only %}
        {% include 'includes/lists/listens.swig' with doc only %}
        {% include 'includes/lists/listeners.swig' with doc only %}
        {% include 'includes/lists/throws.swig' with doc only %}
        {% include 'includes/lists/returns.swig' with doc only %}
    </dl>
</section>
