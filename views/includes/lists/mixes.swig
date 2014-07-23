{% import '../../macros.swig' as macros %}

{% block mixes %}
	{% if mixes && mixes.length %}
		{% block mixes-content %}
            <dt>{{ translate('headings.mixes') }}</dt>
            {{ macros.listitems(mixes, { needsLink: true }) }}
        {% endblock %}
	{% endif %}
{% endblock %}
