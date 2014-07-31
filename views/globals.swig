{% extends 'symbol.swig' %}

{% block main-content %}
    <h {{ cssClass('page-title') }}>{{ translate('headings.globals') }}</h>
    <section>
        {% block symbol-members %}
            {% parent %}
        {% endblock %}
    </section>
{% endblock %}
