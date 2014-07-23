{% import 'macros.swig' as macros %}

{% block method %}
    {% block method-heading -%}
        <h id="{{ doc.id }}">
        {%- spaceless %}
            {% autoescape false %}
                {# TODO: do we even set doc.attribs anymore?? should be badges, right? #}
                {{ doc.attribs }}{{ macros.nameprefix(doc.kind) }}{{ doc.name }}
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
                {# By default, the value of `this` within a method is not documented. #}
            {% endblock %}

            {% block method-params %}
                {% include 'includes/params.swig' with doc %}
            {% endblock %}

            {% block method-properties %}
                {% include 'includes/properties.swig' with doc %}
            {% endblock %}

            {# TODO: why here? why not an include? #}
            {% block method-type %}
                {% if doc.kind === 'event' && doc.type && doc.type.names %}
                    <dl {{ cssclass('method-type') }}>
                        <dt>{{ translate('headings.type') }}</dt>
                        <dd>
                            {{ macros.type(doc) }}
                        </dd>
                    </dl>
                {% endif %}
            {% endblock %}

            {% block method-content-list %}
                <dl {{ cssclass('!dl-compact') }}>
                    {% block method-sourcefile %}
                        {% include 'includes/sourcefile.swig' with doc %}
                    {% endblock %}
                    {% block method-details %}
                        {% include 'includes/details.swig' with doc %}
                    {% endblock %}
                    {% block method-requires %}
                        {% include 'includes/lists/requires.swig' with doc %}
                    {% endblock %}
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
