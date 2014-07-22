{% block details %}
    {% block details-since %}
        {% include 'lists/since.swig' %}
    {% endblock %}
    {% block details-inherited %}
        {% include 'lists/inherited.swig' %}
    {% endblock %}
    {% block details-deprecated %}
        {% include 'lists/deprecated.swig' %}
    {% endblock %}
    {% block details-author %}
        {% include 'lists/author.swig' %}
    {% endblock %}
    {% block details-copyright %}
        {% include 'lists/copyright.swig' %}
    {% endblock %}
    {% block details-license %}
        {% include 'lists/license.swig' %}
    {% endblock %}
    {% block details-defaultvalue %}
        {% include 'lists/defaultvalue.swig' %}
    {% endblock %}
    {% block details-tutorials %}
        {% include 'lists/tutorials.swig' %}
    {% endblock %}
    {% block details-see %}
        {% include 'lists/see.swig' %}
    {% endblock %}
    {% block details-todo %}
        {% include 'lists/todo.swig' %}
    {% endblock %}
{% endblock %}
