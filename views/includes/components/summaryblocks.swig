{% if config('components.summary') %}
    <section id="summary">
        {# TODO: add constructor summary after issue #50 is fixed #}

        {% set context = {
            summaryItems: members[CATEGORIES.CLASSES],
            summaryHeadingKey: 'childrenHeadings.' + CATEGORIES.CLASSES
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
