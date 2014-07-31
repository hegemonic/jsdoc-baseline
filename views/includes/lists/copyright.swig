{% import '../../macros.swig' as macros %}

{% block copyright %}
    {% if copyright %}
        {% block copyright-content %}
            <dt>{{ translate('headings.copyright') }}</dt>
            {{ macros.listItems(copyright) }}
        {% endblock %}
    {% endif %}
{% endblock %}
