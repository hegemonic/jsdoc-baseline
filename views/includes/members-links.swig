{% import '../macros.swig' as macros %}

{% block members-links %}
    {% if symbolItems && symbolItems.length %}
        <section>
            {% block members-links-heading %}
                <h>{{ translate('headings.' + headingKey, symbolItems.length) }}</h>
            {% endblock %}

            {% block members-links-content %}
                <section>
                    {% for item in symbolItems %}
                        {% set itemName = item.name %}
                        <h>{{ link(item.longname, itemName)|safe }}</h>
                        {% if member.summary %}
                            <p>{% include 'includes/summary.swig' with item %}</p>
                        {% endif %}
                        {% block members-links-source %}
                            {{ macros.sourceFile(item) }}
                        {% endblock %}
                    {% endfor %}
                </section>
            {% endblock %}
        </section>
    {% endif %}
{% endblock %}
