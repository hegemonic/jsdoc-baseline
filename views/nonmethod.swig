{% block nonmethod %}
    {% block nonmethod-heading -%}
        <h id="{{ doc.id }}">
            {%- spaceless %}
                {% autoescape false %}
                    {# TODO: do we even set doc.attribs anymore?? should be badges, right? #}
                    {{ doc.attribs }}{{ macros.nameprefix(doc.kind) }}{{ doc.name }}
                    {% if needsSignature(doc) %}
                        {{ macros.signature(doc) }}
                    {% elif doc.type && doc.type.names %}
                        {# TODO: make <small> tag configurable #}
                        <small {{ cssclass('symbol-type') }}> {{ macros.types(doc) }}</small>
                    {% endif %}
                {% endautoescape %}
            {% endspaceless -%}
        </h>
    {%- endblock %}

    {% block nonmethod-content %}
        {% block nonmethod-description %}
            {% include 'includes/description.swig' with doc %}
        {% endblock %}

        {% block nonmethod-details %}
            {% include 'details.swig' with doc %}
        {% endblock %}

        {% block nonmethod-examples %}
            {% include 'includes/examples.swig' with doc %}
        {% endblock %}

        {% block nonmethod-content-list %}
            {% block nonmethod-fires %}
                <dl>
                    {% include 'includes/lists/fires.swig' with doc %}
                </dl>
            {% endblock %}
        {% endblock %}
    {% endblock %}
{% endblock %}
