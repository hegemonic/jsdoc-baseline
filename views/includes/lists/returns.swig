{% import '../../macros.swig' as macros %}

{%- spaceless %}
    {% if returns && returns.length %}
        {% set descriptions = [] %}
        {% for returned in returns %}
            {% if returned.description %}
                {% set descriptions[descriptions.length] = returned.description %}
            {% endif %}
        {% endfor %}
        {% if descriptions.length %}
            <dt>{{ translate('headings.returns') }}</dt>
            {{ macros.listItems(descriptions) }}
        {% endif %}
    {% endif %}
{% endspaceless -%}
