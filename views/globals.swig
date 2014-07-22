{% extends 'symbol.swig' %}

{% block main-content %}
    <h {{ cssclass('page-title') }}>{{ pageTitle }}</h>
    <section>
        {% block symbol-properties %}
            {% parent %}
        {% endblock %}

        {% block symbol-methods %}
            {% parent %}
        {% endblock %}

        {% block symbol-typedefs %}
            {% parent %}
        {% endblock %}

        {% block symbol-events %}
            {% parent %}
        {% endblock %}
    </section>
{% endblock %}
