{% block details %}
    {% block details-content %}
        {% block details-properties %}
            {% include 'includes/properties.swig' %}
        {% endblock %}
        {% block details-content-list %}
            <dl {{ cssclass('dl-compact') }}>
                {% block details-sourcefile %}
                    {% include 'includes/sourcefile.swig' %}
                {% endblock %}
                {% block details-since %}
                    {% include 'includes/lists/since.swig' %}
                {% endblock %}
                {% block details-inherited %}
                    {% include 'includes/lists/inherited.swig' %}
                {% endblock %}
                {% block details-deprecated %}
                    {% include 'includes/lists/deprecated.swig' %}
                {% endblock %}
                {% block details-author %}
                    {% include 'includes/lists/author.swig' %}
                {% endblock %}
                {% block details-copyright %}
                    {% include 'includes/lists/copyright.swig' %}
                {% endblock %}
                {% block details-license %}
                    {% include 'includes/lists/license.swig' %}
                {% endblock %}
                {% block details-defaultvalue %}
                    {% include 'includes/lists/defaultvalue.swig' %}
                {% endblock %}
                {% block details-tutorials %}
                    {% include 'includes/lists/tutorials.swig' %}
                {% endblock %}
                {% block details-see %}
                    {% include 'includes/lists/see.swig' %}
                {% endblock %}
                {% block details-todo %}
                    {% include 'includes/lists/todo.swig' %}
                {% endblock %}
            </dl>
        {% endblock %}
    {% endblock %}
{% endblock %}
