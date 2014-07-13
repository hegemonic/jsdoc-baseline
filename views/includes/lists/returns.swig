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
                {{ macros.minilist(descriptions, 'returns', 'Returns') }}
            {% endblock %}
        {% endif %}
    {% endspaceless -%}
{%- endblock %}
