{% if config('components.summary') %}
    <section id="summary">
        {# either constructors (for a class) or symbols exported by the module (for a module) #}
        {% if headingDocs %}
            {% set context = {
                summaryItems: headingDocs,
                summaryHeadingKey: headingKey
            } %}
            {% include 'summaryblock.swig' with context only %}
        {% endif %}

        {% set context = {
            summaryItems: members[CATEGORIES.CLASSES],
            summaryHeadingKey: 'childHeadings.' + CATEGORIES.CLASSES
        } %}
        {% include 'summaryblock.swig' with context only %}

        {% set context = {
            summaryItems: members[CATEGORIES.NAMESPACES],
            summaryHeadingKey: 'headings.' + CATEGORIES.NAMESPACES
        } %}
        {% include 'summaryblock.swig' with context only %}

        {% set context = {
            summaryItems: members[CATEGORIES.PROPERTIES],
            summaryHeadingKey: 'headings.' + CATEGORIES.PROPERTIES
        } %}
        {% include 'summaryblock.swig' with context only %}

        {% set context = {
            summaryItems: members[CATEGORIES.FUNCTIONS],
            summaryHeadingKey: 'headings.' + CATEGORIES.FUNCTIONS
        } %}
        {% include 'summaryblock.swig' with context only %}

        {% set context = {
            summaryItems: members[CATEGORIES.TYPEDEFS],
            summaryHeadingKey: 'headings.' + CATEGORIES.TYPEDEFS
        } %}
        {% include 'summaryblock.swig' with context only %}

        {% set context = {
            summaryItems: members[CATEGORIES.EVENTS],
            summaryHeadingKey: 'headings.' + CATEGORIES.EVENTS
        } %}
        {% include 'summaryblock.swig' with context only %}
    </section>
{% endif %}
