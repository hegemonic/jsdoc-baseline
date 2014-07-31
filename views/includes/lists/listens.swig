{% import '../../macros.swig' as macros %}

{% block listens %}
    {% if listens && listens.length %}
        {% block listens-content %}
            <dt>{{ translate('headings.listens') }}</dt>
            {{ macros.listItems(listens, { needsLink: true }) }}
        {% endblock %}
    {% endif %}
{% endblock %}
