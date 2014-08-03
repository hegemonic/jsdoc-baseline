{% import '../macros.swig' as macros %}

{% if symbolItems && symbolItems.length %}
    <section>
        <h>{{ translate('headings.' + headingKey, symbolItems.length) }}</h>

        <section>
            {% for item in symbolItems %}
                {% set itemName = item.name %}
                <h>{{ link(item.longname, itemName)|safe }}</h>
                {% if member.summary %}
                    <p>{% include 'includes/summary.swig' with item only %}</p>
                {% endif %}
                {{ macros.sourceFile(item) }}
            {% endfor %}
        </section>
    </section>
{% endif %}
