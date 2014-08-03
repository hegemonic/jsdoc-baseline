{% for doc in docs %}
    {# Show the top-level heading/summary only once #}
    {% if loop.index0 === 0 %}
        {% set context = { doc: doc } %}
        {% include 'includes/symbolheader.swig' with context only %}

        {# Summary lists of all members #}
        {% set context = { members: members } %}
        {% include 'includes/components/summaryblocks.swig' with context only %}
    {% endif %}

    {#
        The entry point to the symbol documented here. Can be one of:
        1. A class
        2. The only symbol exported by a module (which might be a class)

    #}
    <section id="entrypoint">
        {#
            If a module exports only one symbol, document the symbol here, since
            it's not a member of anything else.
        #}
        {% if doc.kind === 'module' && doc.exports %}
            {% for moduleExports in doc.exports %}
                {% set context = { doc: moduleExports } %}
                {% include 'symbol-detail.swig' with context only %}
            {% endfor %}
        {# Classes also need additional docs, beyond what's in the header. #}
        {% elif doc.kind === 'class' %}
            {% set context = { doc: doc } %}
            {% include 'symbol-detail.swig' with context only %}
        {% endif %}
    </section>
{% endfor %}
