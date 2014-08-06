<section>
    {% block symbol-classes %}
        {% set context = {
            symbolItems: members[CATEGORIES.CLASSES],
            headingKey: CATEGORIES.CLASSES
        } %}
        {% include 'members-links.swig' with context only %}
    {% endblock %}

    {% block symbol-namespaces %}
        {% set context = {
            symbolItems: members[CATEGORIES.NAMESPACES],
            headingKey: CATEGORIES.NAMESPACES
        } %}
        {% include 'members-links.swig' with context only %}
    {% endblock %}

    {% block symbol-properties %}
        {% set context = {
            symbolItems: members[CATEGORIES.PROPERTIES],
            headingKey: CATEGORIES.PROPERTIES
        } %}
        {% include 'members-detail.swig' with context only %}
    {% endblock %}

    {% block symbol-methods %}
        {% set context = {
            symbolItems: members[CATEGORIES.FUNCTIONS],
            headingKey: CATEGORIES.FUNCTIONS
        } %}
        {% include 'members-detail.swig' with context only %}
    {% endblock %}

    {% block symbol-typedefs %}
        {% set context = {
            symbolItems: members[CATEGORIES.TYPEDEFS],
            headingKey: CATEGORIES.TYPEDEFS
        } %}
        {% include 'members-detail.swig' with context only %}
    {% endblock %}

    {% block symbol-events %}
        {% set context = {
            symbolItems: members[CATEGORIES.EVENTS],
            headingKey: CATEGORIES.EVENTS
        } %}
        {% include 'members-detail.swig' with context only %}
    {% endblock %}
</section>
