{% import 'macros.swig' as macros %}

{# TODO: allow users to configure the module type (or autodetect?) #}
{% macro prefix(kind) %}
    {% if kind === 'class' %}
        {{ 'new' }}
    {% endif %}
{% endmacro %}

{% block method %}
    {% block method-heading -%}
        <h id="{{ doc.id }}">
        {%- spaceless %}
            {% autoescape false %}
                {{ doc.attribs }}{{ prefix(doc.kind) }}{{ doc.name }}
                {% if needsSignature(doc) %}
                    {{ macros.signature(doc) }}
                {% endif %}
            {% endautoescape %}
        {% endspaceless -%}
        </h>
    {%- endblock %}

    {% block method-content %}
        <section>
            {% block method-summary %}
                {% include 'includes/summary.swig' with doc %}
            {% endblock %}

            {% block method-description %}
                {% include 'includes/description.swig' with doc %}
            {% endblock %}

            {% block method-examples %}
                {% include 'includes/examples.swig' with doc %}
            {% endblock %}

            {% block method-this %}
                {# Override this block to document the value of `this` within a method. #}
            {% endblock %}

            {% block method-params %}
                {% include 'includes/params.swig' with doc %}
            {% endblock %}

            {# TODO: why here? why not an include? #}
            {% block method-type %}
                {% if doc.kind === 'event' && doc.type && doc.type.names %}
                    <dl {{ cssclass('method-type') }}>
                        <dt>Type</dt>
                        <dd>
                            {{ macros.type(doc) }}
                        </dd>
                    </dl>
                {% endif %}
            {% endblock %}

            {% block method-details %}
                {% include 'details.swig' with doc %}
            {% endblock %}

            {% block method-content-list %}
                <dl>
                    {% block method-fires %}
                        {% include 'includes/lists/fires.swig' with doc %}
                    {% endblock %}

                    {% block method-listens %}
                        {% include 'includes/lists/listens.swig' with doc %}
                    {% endblock %}

                    {% block method-listeners %}
                        {% include 'includes/lists/listeners.swig' with doc %}
                    {% endblock %}

                    {% block method-exceptions %}
                        {% include 'includes/lists/throws.swig' with doc %}
                    {% endblock %}

                    {% block method-returns %}
                        {% include 'includes/lists/returns.swig' with doc %}
                    {% endblock %}
                </dl>
            {% endblock %}
        </section>
    {% endblock %}
{% endblock %}
