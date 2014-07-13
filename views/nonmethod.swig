{% block nonmethod %}
    {% block nonmethod-content %}
        {% block nonmethod-description %}
            {% include 'includes/description.swig' with doc %}
        {% endblock %}

        {% block nonmethod-details %}
            {% include 'details.swig' with doc %}
        {% endblock %}

        {% block nonmethod-examples %}
            {% include 'includes/examples.swig' with doc %}
        {% endblock %}

        {% block nonmethod-content-list %}
            {% block nonmethod-fires %}
                <dl>
                    {% include 'includes/lists/fires.swig' with doc %}
                </dl>
            {% endblock %}
        {% endblock %}
    {% endblock %}
{% endblock %}
