{% if symbolItems && symbolItems.length %}
    <h>{{ translate('headings.' + headingKey, symbolItems.length) }}</h>
    <section>
        {% for item in symbolItems %}
            {% set context = { doc: item } %}
            {% include '../symbol-detail.swig' with context only %}
        {% endfor %}
    </section>
{% endif %}
