{% import '../../macros.swig' as macros %}

{% block license %}
    {% if license %}
        {% block license-content %}
            <dt>{{ translate('headings.license') }}</dt>
            {{ macros.listItems(license) }}
        {% endblock %}
    {% endif %}
{% endblock %}
