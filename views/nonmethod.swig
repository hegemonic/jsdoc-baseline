{% block nonmethod %}
    {% block nonmethod-heading -%}
        {# TODO: can we make the heading a single include for methods and non-methods? #}
        {# TODO: do we need to separate methods and non-methods at all?? #}
        <h id="{{ doc.id }}">
            {% autoescape false %}
                {# TODO: do we even set doc.attribs anymore?? should be badges, right? #}
                {{ doc.attribs }}{{ macros.namePrefix(doc.kind) }}{{ doc.name }}
                {% if needsSignature(doc) %}
                    {{ macros.signature(doc) }}
                {% elif doc.type && doc.type.names %}
                    {# TODO: make <small> tag configurable #}
                    <small {{ cssClass('symbol-type') }}> {{ macros.types(doc) }}</small>
                {% endif %}
            {% endautoescape %}
        </h>
    {%- endblock %}

    {% block nonmethod-content %}
        {% block nonmethod-description %}
            {% include 'includes/description.swig' with doc %}
        {% endblock %}

        {% block nonmethod-properties %}
            {% include 'includes/propertytable.swig' with doc %}
        {% endblock %}

        {% block nonmethod-examples %}
            {% include 'includes/examples.swig' with doc %}
        {% endblock %}

        {% block nonmethod-content-list %}
            <dl {{ cssClass('!dl-compact') }}>
                {% block nonmethod-sourcefile %}
                    {% include 'includes/sourcefile.swig' with doc %}
                {% endblock %}
                {% block nonmethod-details %}
                    {% include 'includes/details.swig' with doc %}
                {% endblock %}
                {% block nonmethod-fires %}
                     {% include 'includes/lists/fires.swig' with doc %}
                {% endblock %}
            </dl>
        {% endblock %}
    {% endblock %}
{% endblock %}
