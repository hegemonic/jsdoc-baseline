{% import '../../macros.swig' as macros %}

{% block augments %}
    {% if augments && augments.length %}
        {% block augments-content %}
            <dt>{{ translate('headings.augments') }}</dt>
            {{ macros.listItems(augments, { needsLink: true }) }}
        {% endblock %}
    {% endif %}
{% endblock %}
