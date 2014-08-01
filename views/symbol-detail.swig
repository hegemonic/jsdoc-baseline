{% import 'macros.swig' as macros %}

{% block symbol-detail -%}
    {%- block symbol-detail-heading -%}
        <h id="{{ doc.id }}">
            {%- spaceless %}
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
    {%- endblock %}

    {% block symbol-detail-content %}
        <section>
            {% block symbol-detail-description %}
                {% include 'includes/description.swig' with doc %}
            {% endblock %}

            {% block symbol-detail-examples %}
                {% include 'includes/examples.swig' with doc %}
            {% endblock %}

            {% block symbol-detail-this %}
                {# By default, the value of `this` within a method is not documented. #}
            {% endblock %}

            {% block symbol-detail-params %}
                {% include 'includes/params.swig' with doc %}
            {% endblock %}

            {% block symbol-detail-properties %}
                {% include 'includes/propertytable.swig' with doc %}
            {% endblock %}

            {% block symbol-detail-content-list %}
                <dl {{ cssClass('!dl-compact') }}>
                    {% block symbol-detail-sourcefile %}
                        {% include 'includes/sourcefile.swig' with doc %}
                    {% endblock %}
                    {% block symbol-detail-augments %}
                        {% include 'includes/lists/augments.swig' with doc %}
                    {% endblock %}
                    {% block symbol-detail-details %}
                        {% include 'includes/details.swig' with doc %}
                    {% endblock %}
                    {% block symbol-detail-requires %}
                        {% include 'includes/lists/requires.swig' with doc %}
                    {% endblock %}
                    {% block symbol-detail-fires %}
                        {% include 'includes/lists/fires.swig' with doc %}
                    {% endblock %}
                    {% block symbol-detail-listens %}
                        {% include 'includes/lists/listens.swig' with doc %}
                    {% endblock %}
                    {% block symbol-detail-listeners %}
                        {% include 'includes/lists/listeners.swig' with doc %}
                    {% endblock %}
                    {% block symbol-detail-exceptions %}
                        {% include 'includes/lists/throws.swig' with doc %}
                    {% endblock %}
                    {% block symbol-detail-returns %}
                        {% include 'includes/lists/returns.swig' with doc %}
                    {% endblock %}
                </dl>
            {% endblock %}
        </section>
    {% endblock %}
{% endblock %}
