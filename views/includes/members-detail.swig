{% if symbolItems && symbolItems.length %}
    <section>
        <h>{{ translate('headings.' + headingKey, symbolItems.length) }}</h>
        <section>
            {% for item in symbolItems %}
                {% set context = { doc: item } %}
                {% include '../symbol-detail.swig' with context %}
            {% endfor %}
        </section>
    </section>
{% endif %}
