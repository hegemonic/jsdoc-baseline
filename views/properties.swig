{% import 'macros.swig' as macros %}

{# TODO: make sure this has fine-grained blocks a la method.swig #}
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
                        {% else %}
                            {{ macros.types(property) }}
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

                {# TODO: does this work?? #}
                {% block property-details %}
                    {% include 'details.swig' with property %}
                {% endblock %}

                {% block property-examples %}
                    {% set context = { examples: property.examples } %}
                    {% include 'includes/examples.swig' with context %}
                {% endblock %}
            </section>
        {% endblock %}
    {% endfor %}
{% endblock %}
