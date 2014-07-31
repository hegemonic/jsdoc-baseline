{% import '../../macros.swig' as macros %}

{% block version %}
    {% if version %}
        {% block version-content %}
            <dt>{{ translate('headings.version') }}</dt>
            <dd>{{ version|resolveLinks|markdown }}</dd>
        {% endblock %}
    {% endif %}
{% endblock %}
