{% import '../../macros.swig' as macros %}

{% block returns -%}
    {%- spaceless %}
        {% if returns && returns.length %}
            {% block returns-content %}
                {% set descriptions = [] %}
                {% for returned in returns %}
                    {% if returned.description %}
                        {% set descriptions[descriptions.length] = returned.description %}
                    {% endif %}
                {% endfor %}
                {% if descriptions.length %}
                    <dt>Returns</dt>
                    {{ macros.listitems(descriptions) }}
                {% endif %}
            {% endblock %}
        {% endif %}
    {% endspaceless -%}
{%- endblock %}
