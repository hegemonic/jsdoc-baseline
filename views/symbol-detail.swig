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
    {% include 'includes/description.swig' with doc %}
    {% include 'includes/examples.swig' with doc %}
    {% include 'includes/params.swig' with doc %}
    {% include 'includes/propertytable.swig' with doc %}

    <dl {{ cssClass('!dl-compact') }}>
        {% include 'includes/sourcefile.swig' with doc %}
        {% include 'includes/lists/augments.swig' with doc %}
        {% include 'includes/details.swig' with doc %}
        {% include 'includes/lists/requires.swig' with doc %}
        {% include 'includes/lists/fires.swig' with doc %}
        {% include 'includes/lists/listens.swig' with doc %}
        {% include 'includes/lists/listeners.swig' with doc %}
        {% include 'includes/lists/throws.swig' with doc %}
        {% include 'includes/lists/returns.swig' with doc %}
    </dl>
</section>
