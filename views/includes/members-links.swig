{% import '../macros.swig' as macros %}

{% block members-links %}
    {% if symbolItems && symbolItems.length %}
        {% block symbol-members-links %}
            <section>
                {% block symbol-members-links-heading %}
                    <h>{{ translate('headings.' + headingKey, symbolItems.length) }}</h>
                {% endblock %}

                {% block symbol-members-links-content %}
                    <section>
                        {% for item in symbolItems %}
                            {% set itemName = item.name %}
                            <h>{{ link(item.longname, itemName)|safe }}</h>
                            {% if member.summary %}
                                <p>{% include 'includes/summary.swig' with item %}</p>
                            {% endif %}
                            {% block symbol-members-links-source %}
                                {{ macros.sourceFile(item) }}
                            {% endblock %}
                        {% endfor %}
                    </section>
                {% endblock %}
            </section>
        {% endblock %}
    {% endif %}
{% endblock %}
