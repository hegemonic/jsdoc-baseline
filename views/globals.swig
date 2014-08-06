{% extends 'symbol.swig' %}

{% block main-content %}
    <h {{ cssClass('page-title') }}>{{ translate('headings.globals') }}</h>
    {% set context = { members: members } %}

    {# Summary lists of all members #}
    {% include 'includes/components/summaryblocks.swig' with context only %}

    {% block symbol-content %}
        {% include 'includes/symbolcontent.swig' with context only %}
    {% endblock %}
{% endblock %}
