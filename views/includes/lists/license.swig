{% import '../../macros.swig' as macros %}

{% block license %}
    {% if license %}
        {% block license-content %}
            {{ macros.minilist(license, 'license', 'License') }}
        {% endblock %}
    {% endif %}
{% endblock %}
