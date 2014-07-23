{% import '../../macros.swig' as macros %}

{% block deprecated %}
    {% if deprecated %}
        {% block deprecated-content %}
            <dt>{{ translate('headings.deprecated') }}</dt>
            {{ macros.listitems(deprecated) }}
        {% endblock %}
    {% endif %}
{% endblock %}
