{% extends 'layout.swig' %}

{% block banner-content %}
    {# TODO #}
{% endblock %}

{% block main-content %}
    {% if package || readme %}
        {% block package-title %}
            {% set context = { package: package } %}
            {% include 'includes/packagetitle.swig' with context only %}
        {% endblock %}

        {% block readme %}
            {% if readme %}
                <article>{{ readme }}</article>
            {% endif %}
        {% endblock %}

        {# TODO: make this configurable, with multiple options #}
        {% block symbol-index %}
            {% set context = { docs: docs } %}
            {% include 'includes/components/symbolindex.swig' with context only %}
        {% endblock %}
    {% endif %}
{% endblock %}
