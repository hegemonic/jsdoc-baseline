{% block members-detail %}
    {% if symbolItems && symbolItems.length %}
        <section>
            {% block members-detail-heading %}
                <h>{{ translate('headings.' + headingKey, symbolItems.length) }}</h>
            {% endblock %}

            {% block members-detail-content %}
                <section>
                    {% for item in symbolItems %}
                        {% set context = { doc: item } %}
                        {% include '../symbol-detail.swig' with context %}
                    {% endfor %}
                </section>
            {% endblock %}
        </section>
    {% endif %}
{% endblock %}
