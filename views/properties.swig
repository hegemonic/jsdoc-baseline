{% import 'macros.swig' as macros %}

{# TODO: make sure this has fine-grained blocks a la method.swig #}
{# TODO: rename to avoid confusion with includes/ (or move this?) #}
{% block properties %}
    {% if properties && properties.length %}
        {% for property in properties %}
            {% block property %}
                {% block property-heading %}
                    <h {{ cssClass('property-name') }} id="{{ property.id }}">
                        {# TODO: can we move this to an include? #}
                        {{ property.attribs }}{{ property.name }}
                        {% if needsSignature(property) %}
                            {{ macros.signature(property) }}
                        {% elif property.type && property.type.names %}
                            {# TODO: make <small> tag configurable #}
                            <small {{ cssClass('property-type') }}>
                                {{ macros.types(property) }}
                            </small>
                        {% endif %}
                    </h>
                {% endblock %}
                {% block property-content %}
                    {% block property-description %}
                        {% include 'includes/description.swig' with property %}
                    {% endblock %}

                    {% block property-properties %}
                        {% if property.properties %}
                            {{ macros.infotable(property.properties, {
                                hideOptional: true,
                                isEnum: property.isEnum
                            }) }}
                        {% endif %}
                    {% endblock %}

                    {% block property-content-list %}
                        <dl {{ cssClass('!dl-compact') }}>
                            {% block property-source %}
                                {% set context = { doc: property } %}
                                {% include 'includes/sourcefile.swig' with context %}
                            {% endblock %}

                            {#
                                TODO: display the type of typedefs:
                                https://github.com/jsdoc3/jsdoc/commit/bca6cdc5
                                but this is covered by macros.types(property), right?
                            #}

                            {# TODO: does this work? does it make any sense here? replace with properties table? #}
                            {% block property-content-list %}
                                {% block property-details %}
                                    {% include 'includes/details.swig' with property %}
                                {% endblock %}
                            {% endblock %}
                        </dl>
                    {% endblock %}
                {% endblock %}
            {% endblock %}
        {% endfor %}
    {% endif %}
{% endblock %}
