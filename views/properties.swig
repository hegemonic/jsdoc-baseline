{% import 'macros.swig' as macros %}

{# TODO: make sure this has fine-grained blocks a la method.swig #}
{# TODO: rename to avoid confusion with includes/ (or move this?) #}
{% block properties %}
    {% for property in properties %}
        {% block property %}
            {% block property-heading %}
                {% spaceless %}
                    <h {{ cssclass('property-name', 'list-wrapper') }} id="{{ property.id }}">
                        {# TODO: can we move this to an include? #}
                        {{ property.attribs }}{{ property.name }}
                        {% if needsSignature(property) %}
                            {{ macros.signature(property) }}
                        {% elif property.type && property.type.names %}
                            {# TODO: make <small> tag configurable #}
                            <small {{ cssclass('property-type') }}>
                                {{ macros.types(property) }}
                            </small>
                        {% endif %}
                    </h>
                {% endspaceless %}
                {% block property-source %}
                    {{ macros.sourcefile(property) }}
                {% endblock %}
            {% endblock %}

            <section>
                {% block property-description %}
                    {% include 'includes/description.swig' with property %}
                {% endblock %}

                {#
                    TODO: display the type of typedefs:
                    https://github.com/jsdoc3/jsdoc/commit/bca6cdc5
                    but this is covered by macros.types(property), right?
                #}

                {# TODO: does this work? does it make any sense here? replace with properties table? #}
                {% block property-details %}
                    <dl {{ cssclass('!dl-compact') }}>
                        {% include 'includes/details.swig' with property %}
                    </dl>
                {% endblock %}

                {# TODO: does this work? does it make any sense here? #}
                {% block property-examples %}
                    {% set context = { examples: property.examples } %}
                    {% include 'includes/examples.swig' with context %}
                {% endblock %}
            </section>
        {% endblock %}
    {% endfor %}
{% endblock %}
